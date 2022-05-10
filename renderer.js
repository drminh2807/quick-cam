var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } } })
		.then(function (stream) {
			video.srcObject = stream;
		})
		.catch(function (err0r) {
			console.log("Something went wrong!");
		});
}