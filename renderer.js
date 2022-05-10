var video = document.querySelector("#videoElement");

navigator.mediaDevices
	.enumerateDevices()
	.then(gotDevices)
	.then(getStream)
	.catch(handleError);

function gotDevices(deviceInfos) {
	const videoSelect = deviceInfos.filter(i => i.kind === 'videoinput')
		.map((item, index) => ({
			text: item.label || `camera ${index}`,
			value: item.deviceId
		}))

	window.api.setCameraSources(videoSelect);
	window.api.addCameraIdUpdateListener((cameraId) => {
		window.cameraId = cameraId
		getStream()
	})
}

function getStream() {
	if (window.stream) {
		window.stream.getTracks().forEach(function (track) {
			track.stop();
		});
	}

	const constraints = {
		video: window.cameraId !== undefined ?
			{ deviceId: { exact: window.cameraId } } :
			{ width: { ideal: 1920 }, height: { ideal: 1080 } },
	};
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(gotStream)
		.catch(handleError);
}

function gotStream(stream) {
	window.stream = stream; // make stream available to console
	video.srcObject = stream;
}

function handleError(error) {
	console.error("Error: ", error);
}