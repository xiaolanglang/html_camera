var video = document.querySelector('video');
var /*audio,*/ audioType;

var canvas1 = document.getElementById('canvas1');
var context1 = canvas1.getContext('2d');

var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext('2d');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

var exArray = []; //存储设备源ID  
MediaStreamTrack.getSources(function(sourceInfos) {
    for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        //这里会遍历audio,video，所以要加以区分
        if (sourceInfo.kind === 'video') {
            exArray.push(sourceInfo.id);
        }
    }
    alert(exArray.length);
});

function getMedia() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            'video': {
                'optional': [{
                    'sourceId': exArray[0] //0为前置摄像头，1为后置  
                }]
            },
            'audio': false
        }, successFunc, errorFunc); //success是获取成功的回调函数
    } else {
        alert('Native device media streaming (getUserMedia) not supported in this browser.');
    }
}

function successFunc(stream) {
    //alert('Succeed to get media!');  
    if (video.mozSrcObject !== undefined) {
        //Firefox中，video.mozSrcObject最初为null，而不是未定义的，我们可以靠这个来检测Firefox的支持  
        video.mozSrcObject = stream;
    } else {
        video.src = window.URL && window.URL.createObjectURL(stream) || stream;
    }

    video.play();

    // 音频  
    // audio = new Audio();  
    // audioType = getAudioType(audio);  
    // if (audioType) {  
    //     audio.src = 'polaroid.' + audioType;  
    //     audio.play();  
    // }  
}

function errorFunc(e) {
    alert(e.message); 
    alert(e.description);
    alert(e.number);
    alert(e.name);
}


// 将视频帧绘制到Canvas对象上,Canvas每60ms切换帧，形成肉眼视频效果  
function drawVideoAtCanvas(video, context) {
    window.setInterval(function() {
        context.drawImage(video, 0, 0, 80, 120);
    }, 60);
}

//获取音频格式  
function getAudioType(element) {
    if (element.canPlayType) {
        if (element.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== '') {
            return ('aac');
        } else if (element.canPlayType('audio/ogg; codecs="vorbis"') !== '') {
            return ("ogg");
        }
    }
    return false;
}

// vedio播放时触发，绘制vedio帧图像到canvas  
//        video.addEventListener('play', function () {  
//            drawVideoAtCanvas(video, context2);  
//        }, false);  

//拍照  
function getPhoto() {
    context1.drawImage(video, 0, 0, 90, 120); //将video对象内指定的区域捕捉绘制到画布上指定的区域，实现拍照。  
}

//视频  
function getVedio() {
    drawVideoAtCanvas(video, context2);
}