//inject angular file upload directives and services.
// var app = angular.module('fileUpload', ['ngFileUpload']);

// app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
//     $scope.uploadFiles = function(files, errFiles) {
//         $scope.files = files;
//         $scope.errFiles = errFiles;
//         angular.forEach(files, function(file) {
//             file.upload = Upload.upload({
//                 url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
//                 data: {file: file}
//             });

//             file.upload.then(function (response) {
//                 $timeout(function () {
//                     file.result = response.data;
//                 });
//             }, function (response) {
//                 if (response.status > 0)
//                     $scope.errorMsg = response.status + ': ' + response.data;
//             }, function (evt) {
//                 file.progress = Math.mi"n(100, parseInt(100.0 * evt.loaded / evt.total));
//             });
//         });
//     }
// }]);

var myapp = angular.module("myapp", ["firebase"]);

myapp.service('Uploader', ['$firebaseArray', function($firebaseArray) {
  var ref = new Firebase('https://pixalbum.firebaseio.com/');
  var episodes = $firebaseArray(ref);
  var id;
  return {
    all: episodes,
    create: function(img) {
      //Add to firebase db
      return episodes.$add(img).then(function(ref){
        id = ref.key();
        console.log('img id:', id);
      });
    },
    getAll: function(cb) {
      // console.log('inside getAll:', id);
      // console.log('inside getAll: episodes-', episodes);
      episodes.$loaded()
      .then(function(){
        var result = [];
        //console.log(episodes.length);
        for (var i=0;i<episodes.length;i++) {
          //console.log(episodes[i]);
          result.push(episodes[i].$value.toString());
        }        
        console.log(result);
        cb(result);
      })
      .catch(function(err){
        console.log('inside getAll',err);
      });

      // episodes.forEach(function(el){
        // console.log('el',el);
        // console.log('el.$value',el.$value);
      //});//.$getRecord(id);
    }
  };
}])
.controller('UploadCtrl', function ($scope, Uploader) {
  $scope.loadClicked = false;
  $scope.episodes = Uploader.all;
  $scope.createEpisode = function() {
    console.log("createEpisode");
    console.log($scope.episodeImgData);
    console.log('$scope.episode',$scope.episode);
    // if ($scope.episodeImgData) {
    //   $scope.episode.img1 = $scope.episodeImgData;
    // }
    Uploader.create($scope.episodeImgData);
  };
  $scope.handleFileSelectAdd = function(evt) {
    console.log("handleFileSelectAdd");
    console.log(evt.target);
    var f = evt.target.files[0];
    console.log("f:",f);
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        var filePayload = e.target.result;
        $scope.episodeImgData = e.target.result; 
        document.getElementById('pano').src = $scope.episodeImgData; 
      };
    })(f);
    reader.readAsDataURL(f);
  };
  $scope.getImg = function() {
    $scope.loadClicked = true;
    Uploader.getAll(function(imgList){
      $scope.imgList = imgList;      
    });
    //$scope.imgList = Uploader.all;
    //console.log("inside getImg:", imgList);
    //document.getElementById('pano').src = img;
  };
  document.getElementById('file-upload').addEventListener('change', $scope.handleFileSelectAdd, false);
});

//inject angular file upload directive.
// var app = angular.module('app', ['ngFileUpload']);

// app.controller( [ '$scope', 'Upload', function($scope, Upload) {
//   $scope.onFileSelect = function($files) {
//     //$files: an array of files selected, each file has name, size, and type.
//     for (var i = 0; i < $files.length; i++) {
//       var $file = $files[i];
//       Upload.upload({
//         url: 'my/upload/url',
//         file: $file,
//         progress: function(e){}
//       }).then(function(data, status, headers, config) {
//         // file is uploaded successfully
//         console.log(data);
//       }); 
//     }
//   }
// }]
// );