function makeSound(fileName, isSprite, isLoop, sprites)  {
  let path = "snd/" + fileName + ".mp3";
  let settings = {src: path};
  if (isSprite) {
    settings.sprite = sprites;
  }
  if (isLoop) {
    settings.loop = true
  }
  return new Howl(settings);
}
