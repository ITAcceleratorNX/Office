/** Пути к интерьерным фото офисов для карусели на странице объекта. */

function galleryPaths(slug, count) {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `/assets/offices/${slug}/${slug}-${n}.jpg`;
  });
}

const OFFICE_PHOTOS = {
  "almaty-plaza": galleryPaths("almaty-plaza", 7),
  "abylai-khan-plaza": galleryPaths("abylai-khan-plaza", 7),
  "alatau-grand": galleryPaths("alatau-grand", 7),
  venus: galleryPaths("venus", 7),
  stanitsa: galleryPaths("stanitsa", 1),
  "koktem-grand": galleryPaths("koktem-grand", 7),
  "nurly-tau": galleryPaths("nurly-tau", 7),
};

export function getOfficePhotos(slug) {
  return OFFICE_PHOTOS[slug] ?? null;
}
