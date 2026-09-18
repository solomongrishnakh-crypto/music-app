export interface Song {
  /** YouTube-Video-ID — dient gleichzeitig als eindeutige Song-ID */
  id: string;
  title: string;
  artist: string;
  /** Cover-/Thumbnail-URL von YouTube */
  coverUrl: string;
}
