require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({credentials: true, origin:'http://localhost:3000'}));



app.post("/getToken", async function(req, res){
    console.log(req.body, "artistaa")
    console.log("ta")
    const {artist, minValue, maxValue} = req.body
    token = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    });
    const {access_token} = await token.json();
    artistResponse = await fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=1`,{
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    });
    const {artists: {items}} = await artistResponse.json();
    const {id} = items[0];
    console.log(id)
    console.log(access_token)
    if (id == ""){
        res.json(["1"]);
    }
    else{
        const limit = Math.floor(Math.random() * 26) + 10;
        tracksResponse = await fetch(`https://api.spotify.com/v1/recommendations?limit=${limit}&seed_artists=${id}&min_popularity=${minValue}&max_popularity=${maxValue}`,{
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });
        const {tracks} = await tracksResponse.json();
        const no_of_tracks = tracks.length;
        console.log("no of tracks",no_of_tracks)
        console.log("ta")
        let tracksList = [];
        let rnd_list = [];
        for(let i = 0; i < 6; i++){
            let random_take = Math.floor(Math.random() * no_of_tracks);
            while(rnd_list.includes(random_take)){
                random_take = Math.floor(Math.random() * no_of_tracks);
            }
            rnd_list.push(random_take);
            tracksList.push(tracks[random_take]);
        }
        res.json(tracksList);         
    }
});



app.listen(process.env.PORT || 4000, function(req, res){
    console.log("Listening");
});
