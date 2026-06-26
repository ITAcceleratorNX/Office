/** Пути к интерьерным фото офисов для карусели на странице объекта. */

function galleryPaths(slug, count) {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `/assets/offices/${slug}/${slug}-${n}.jpg`;
  });
}

const OFFICE_PHOTOS = {
  "abylai-khan-plaza": galleryPaths("abylai-khan-plaza", 7),
  "alatau-grand": galleryPaths("alatau-grand", 7),
  "almaty-plaza": galleryPaths("almaty-plaza", 7),
  "avrora": galleryPaths("avrora", 2),
  "d-43": galleryPaths("d-43", 2),
  "element-tower": galleryPaths("element-tower", 5),
  "fortis": galleryPaths("fortis", 5),
  "green-tower": galleryPaths("green-tower", 7),
  "koktem-grand": galleryPaths("koktem-grand", 7),
  "nurly-tau": galleryPaths("nurly-tau", 7),
  "prime": galleryPaths("prime", 2),
  "rams": galleryPaths("rams", 4),
  "stanitsa": galleryPaths("stanitsa", 3),
  "star": galleryPaths("star", 3),
  "time-square": galleryPaths("time-square", 7),
  "venus": galleryPaths("venus", 11),
};

export function getOfficePhotos(slug) {
  return OFFICE_PHOTOS[slug] ?? null;
}
