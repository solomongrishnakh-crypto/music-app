#!/bin/sh
# Testlauf im Android-Emulator (wird von .github/workflows/android-test.yml gestartet).
# Schreibt Screenshots und einen Bericht nach emu-out/.
P=space.centaurian.app
O=emu-out
mkdir -p $O
R=$O/report.txt
shot() { adb exec-out screencap -p > "$O/$1.png"; }
echo "== Emulator-Test ==" > $R
adb install -r android/app/build/outputs/apk/debug/app-debug.apk >> $R 2>&1
adb shell pm grant $P android.permission.POST_NOTIFICATIONS >> $R 2>&1
adb shell pm grant $P android.permission.RECORD_AUDIO >> $R 2>&1
adb shell pm grant $P android.permission.ACCESS_FINE_LOCATION >> $R 2>&1
adb shell pm grant $P android.permission.ACCESS_COARSE_LOCATION >> $R 2>&1
adb logcat -c
adb shell am start -n $P/.MainActivity >> $R 2>&1
sleep 45
shot 01_start
adb shell dumpsys gfxinfo $P reset > /dev/null 2>&1
# etwas wischen und tippen (Scrollen / Menue)
adb shell input swipe 540 1600 540 600 400; sleep 2
shot 02_gescrollt
# Thread-Dump der App (zeigt, was den Haupt-Thread blockiert)
adb root > /dev/null 2>&1; sleep 2
adb shell kill -3 $(adb shell pidof $P | tr -d "\r") 2>/dev/null; sleep 3
adb shell "ls /data/anr" >> $R 2>&1
adb pull /data/anr $O/anr > /dev/null 2>&1
adb shell input swipe 540 600 540 1600 400; sleep 2
adb shell input tap 540 1200; sleep 5
shot 03_nach_tippen
echo "" >> $R
echo "== Ruckeln (gfxinfo) ==" >> $R
adb shell dumpsys gfxinfo $P | grep -E "Total frames|Janky frames|50th|90th|95th|99th" >> $R
echo "" >> $R
echo "== Abstuerze / ANR waehrend des Tests ==" >> $R
adb logcat -d | grep -E "FATAL EXCEPTION|ANR in|Process: $P" | head -20 >> $R
echo "(Ende der Liste)" >> $R
# Sternenhimmel oeffnen (Karte "Night Sky Live" auf der Universum-Seite) und ein Objekt antippen
adb shell input tap 540 2050; sleep 40
shot 04_sternenhimmel
adb shell input tap 540 1200; sleep 8
shot 05_objekt_angetippt
adb shell input swipe 700 1500 300 1100 300; sleep 5
shot 06_nach_wischen
echo "" >> $R
echo "== Sternenhimmel: Abstuerze / ANR ==" >> $R
adb logcat -d | grep -E "FATAL EXCEPTION|ANR in .*centaurian|ANR in space" | head -10 >> $R
echo "(Ende der Liste)" >> $R
adb shell dumpsys gfxinfo $P | grep -E "Total frames|Janky frames" >> $R
# App aus der Liste wischen
adb shell input keyevent KEYCODE_APP_SWITCH; sleep 3
shot 07_uebersicht
adb shell input swipe 700 1500 700 250 200; sleep 8
shot 08_nach_wegwischen
echo "" >> $R
echo "== Nach Wegwischen aus der Liste ==" >> $R
echo "Prozess laeuft noch: $(adb shell pidof $P | tr -d '\r')" >> $R
echo "MusicService aktiv: $(adb shell dumpsys activity services $P | grep -c 'MusicService')" >> $R
adb logcat -d > $O/logcat.txt
cat $R
