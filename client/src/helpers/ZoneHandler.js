export default class ZoneHandler {
  constructor(scene) {
    this.renderZone = (x, y) => {
      //zona di spawn delle carte
      let dropZone = scene.add
        .zone(x, y, scene.scale.width / 2, scene.scale.height - 150)
        .setRectangleDropZone(scene.scale.width / 2, scene.scale.height - 150)
        .setDepth(-1);
      //tengo monitorate le carte che vengono droppate, mi serve per spostare le carte sulla board
      //quando vengono giocate
      //dropZone.setData({ cards: 0 });
      return dropZone;
    };

    this.renderOutline = (dropZone) => {
      //outline della zona di spawn per renderla visibile
      let dropZoneOutline = scene.add.graphics();
      dropZoneOutline.lineStyle(2, 0xff69b4);
      dropZoneOutline.strokeRect(
        dropZone.x - dropZone.input.hitArea.width / 2,
        dropZone.y - dropZone.input.hitArea.height / 2,
        dropZone.input.hitArea.width,
        dropZone.input.hitArea.height
      );
    };
  }
}
