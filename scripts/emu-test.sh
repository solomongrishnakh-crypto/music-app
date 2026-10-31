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
# Zurueck-Taste: App wirklich schliessen
adb shell input keyevent KEYCODE_BACK; sleep 2
adb shell input keyevent KEYCODE_BACK; sleep 5
shot 04_nach_zurueck
echo "" >> $R
echo "== Nach Zurueck-Taste ==" >> $R
echo "Prozess laeuft noch: $(adb shell pidof $P | tr -d '\r')" >> $R
echo "MusicService aktiv: $(adb shell dumpsys activity services $P | grep -c 'MusicService')" >> $R
adb shell dumpsys activity activities | grep -E "mResumedActivity|topResumedActivity" | head -2 >> $R
adb logcat -d > $O/logcat.txt
cat $R
