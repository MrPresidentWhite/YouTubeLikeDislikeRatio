// ==UserScript==
// @name         YouToube Like/Disklike Ratio
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script displays the like/dislike ratio in percent of a YouTube Video using the ReturnYouTubeDislikeAPI
// @author       Mr_President_White#0420 (discord) | https://github.com/MrPresidentWhite (GitHub)
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    setTimeout(getRatio, 2500);
})();

function getRatio() {
    var youtubeURL = new URL(window.location.href);
    var url = 'https://returnyoutubedislikeapi.com/votes?videoId=' + youtubeURL.searchParams.get('v');

    try {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var a = JSON.parse(response.responseText);
                var dislikes = a.dislikes;
                var likes = a.likes;
                var totalVotes = likes + dislikes;

                var prozentDislikes = 100 * dislikes / totalVotes;
                var prozentLikes = 100 * likes / totalVotes;

                var elements = document.getElementsByTagName('ytd-toggle-button-renderer');

                for (var i = 0; i <= elements.length; i++) {
                    var tmp = elements[i].getElementsByTagName('yt-formatted-string')[0];

                    if (i == 0) {
                        tmp.innerText += '\r\n' + prozentLikes.toFixed(1) + '% Likes';
                    } else if (i == 1) {
                        tmp.innerText += '\r\n' + prozentDislikes.toFixed(1) + '% Dislikes';
                        break;
                    }
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
}
