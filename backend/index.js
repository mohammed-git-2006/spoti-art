"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const CLIENT_ID = `b26800748d934e0d89c24aa04a9de7d1`;
const CLIENT_SECRET = '9eb05c612add425facebbe433fd337ea';
const REDIRECT_URI = `https://www.spotiart.com/callback`;
//const TMEP_KEY = 'AQCw2Q6LlsjRyfcynhXuOxyiSM4Wz9X0OHhPbW4Z4EomlDwowqOwAyGY8tLbSV82i16VzAEwQS_KMgyvntbJUY8pv2qGZAnR28Oz6gRLTvCHRbTDdTyXWB-ubx9s5uJbpA2TvSOIE6A84Jg5Zu03UR7Y6BvpgXtsWxOhvPNfjzEk6OdB6ECDJgHo7ImdZPTXTa0mVgqex586kgJy3p3FOV7-n4aCYk9cb9meMt90rQ'
const TMEP_KEY = `AQBuYvLARk_mN1gMjF6A5vG0CndD1mi5LZYUcGv5eJaeCuT7EnYJme4GEHT5qUU-CGit_t-r611Wsr0KeTZxgmGualom9pBckJ1ghfUif_rAbNDgzaTUeiLxqNZw6br8soWkSnDEKshsh33gsvAmmi0EmnOQ2a2XobLIZ-M6vxwy8-Uo7lunJAxMAoE0wabEm3XDblaJi8XJfhjpqAS_gFRSEDoDI_48HeCHuc16YA`;
const a = (`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=`
    + encodeURIComponent(REDIRECT_URI) + `&scope=` + encodeURI('user-read-recently-played user-top-read'));
function getAccessToken(key, client_id, redirect_uri, client_secret) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    // Spotify requires Basic Auth with clientId:clientSecret
                    "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code: key,
                    redirect_uri: redirect_uri,
                }),
            });
            return yield response.json();
        }
        catch (error) {
            return undefined;
        }
    });
}
getAccessToken(TMEP_KEY, CLIENT_ID, REDIRECT_URI, CLIENT_SECRET).then(r => {
    if (!r) {
        console.error(`Failed to get the access token : ${r}`);
        return;
    }
    console.log(`Access token information:\n${JSON.stringify(r, null, 4)}`);
});
