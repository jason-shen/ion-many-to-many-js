const pubVideo = document.getElementById("localVideo");
const subVideo = document.getElementById("remoteVideos");
const bntPubCam = document.getElementById("bnt_pubcam");
const bntPubScreen = document.getElementById("bnt_pubscreen");

const serverURL = "ws://localhost:7000/ws";

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const signalLocal = new Signal.IonSFUJSONRPCSignal(serverURL);
const clientLocal = new IonSDK.Client(signalLocal, config);

signalLocal.onopen = () => clientLocal.join("test session");

const start = (type) => {
  let videoEl = document.createElement('video');
  if (type) {
    IonSDK.LocalStream.getUserMedia({
      resolution: "vga",
      audio: true,
      codec: "vp8",
    }).then((media) => {
      videoEl.srcObject = media;
      videoEl.autoplay = true;
      videoEl.controls = true;
      videoEl.muted = true;
      pubVideo.appendChild(videoEl);
      bntPubCam.disabled = true;
      bntPubScreen.disabled = true;
      clientLocal.publish(media);
    }).catch(console.error);
  } else {
    IonSDK.LocalStream.getDisplayMedia({
      resolution: "vga",
      audio: true,
      codec: "vp8",
    }).then((media) => {
      videoEl.srcObject = media;
      videoEl.autoplay = true;
      videoEl.controls = true;
      videoEl.muted = true;
      pubVideo.appendChild(videoEl);
      bntPubCam.disabled = true;
      bntPubScreen.disabled = true;
      clientLocal.publish(media);
    }).catch(console.error);
}
}

clientLocal.ontrack = (track, stream) => {
  let videoEl = document.createElement('video');
  console.log("got track: ", track.id, "for stream: ", stream.id);
  if (track.kind === 'video') {
    track.onunmute = () => {
    videoEl.id = track.id;
    videoEl.controls = true;
    videoEl.srcObject = stream;
    videoEl.autoplay = true;
    videoEl.muted = false;
    subVideo.appendChild(videoEl);

  stream.onremovetrack = (e) => {
    if (e.track.kind === 'video') {
      const removeVide = document.getElementById(e.track.id);
      subVideo.removeChild(removeVide);
    }

  }
  }
  }
}