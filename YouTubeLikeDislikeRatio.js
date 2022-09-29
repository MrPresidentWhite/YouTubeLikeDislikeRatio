// ==UserScript==
// @name         YouToube Like/Disklike Ratio
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This script displays the like/dislike ratio in percent of a YouTube Video using the ReturnYouTubeDislikeAPI
// @author       Mr_President_White#0420 (discord) | https://github.com/MrPresidentWhite (GitHub)
// @match        https://www.youtube.com/watch?v=*
// @match        https://www.youtube.com/c/*/videos
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    var url = new URL(window.location.href);
    var pathname = url.pathname;
    if (pathname.includes("/c/")) {
        setTimeout(userpageRatio, 3000);
    } else {
        setTimeout(getRatio, 3000);
    }
})();

function userpageRatio() {
    var videos = [...document.querySelectorAll("#meta.ytd-grid-video-renderer")];
    console.clear();

    videos.forEach(function(item, index) {
        var title = item.querySelector("#video-title");
        var url = new URL(title.href);

        var apiURL = 'https://returnyoutubedislikeapi.com/votes?videoId=' + url.searchParams.get('v');
        var apiJSONData = getAPIResponse(apiURL);

        apiJSONData.then(function(result) {
            var text = "<span style=\"font-weight: 400; font-size: 12px; color: var(--ytd-metadata-line-color, var(--yt-spec-text-secondary));\">Likes: " + getProzentLikesDislikes(result, "likes") + "% • Dislikes: " + getProzentLikesDislikes(result, "dislikes") + "%<span>";
            var metaLine = item.querySelector("#metadata");

            metaLine.innerHTML += text;
        });
    });
}

function getRatio() {
    console.clear();
    var elements = [...document.querySelectorAll('#text.ytd-toggle-button-renderer')];
    var youtubeURL = new URL(window.location.href);
    var url = 'https://returnyoutubedislikeapi.com/votes?videoId=' + youtubeURL.searchParams.get('v');

    var apiJSONData = getAPIResponse(url);

    apiJSONData.then(function(result) {
        elements.forEach(function (item, index) {
            if (index == 0) {
                item.innerText += '\r\n' + getProzentLikesDislikes(result, "likes") + '% Likes';
            } else if (index == 1) {
                item.innerText += '\r\n' + getProzentLikesDislikes(result, "dislikes") + '% Dislikes';
            }
        });
    });
}

function getProzentLikesDislikes(json, voteType) {
    var a = JSON.parse(json);
    var dislikes = a.dislikes;
    var likes = a.likes;
    var totalVotes = likes + dislikes;

    var prozentDislikes = 100 * dislikes / totalVotes;
    var prozentLikes = 100 * likes / totalVotes;

    if (voteType == "likes") {
        return prozentLikes.toFixed(1);
    } else if (voteType == "dislikes") {
        return prozentDislikes.toFixed(1);
    }
}

function getAPIResponse(url) {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      synchronous: true,
      method: "GET",
      url: url,
      onload: function(response) {
        resolve(response.responseText);
      },
      onerror: function(error) {
        reject(error);
      }
    });
  });
}
