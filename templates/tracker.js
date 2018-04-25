emotionList = [];
emotionValue = new Array(0, 0);

function change() {
  if (emotionList.includes(this.id)) {
    delete this.id emotionList;
  } else {
  emotionList.append(this.id);
  }
}

function submit() {
  for (i = 0; i < emotionList.length; i++) {
    if (this.id === "happy" || this.id === "content" || this.id === "excited" || this.id === "surprised") {
      emotionValue[0] += 1;
    }
    else {
      emotionValue[1] += 1;
    }
  }

  var d = new Date();
  $.post("/saveEmotion", {emotions:emotionList, value: emotionValue, date:d} function(response) {
  });
}