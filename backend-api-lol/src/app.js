const express = require("express");
const {json, response} = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const server = express();

server.use(json());
server.use(cors())

server.get('/summoner/:summonerName', async(req,res)=>{
    const {summonerName} = req.params;

    const summonerIdResponse = await axios.get(`${process.env.LOL_URL}/lol/summoner/v4/summoners/by-name/${summonerName}`,
    {headers:{'X-Riot-Token':process.env.LOL_KEY}}).catch(e=>{
        return res.status(e.response.status).json(e.response.data)
    })
    
    const {id,summonerLevel,name,profileIconId} = summonerIdResponse.data;

    const responseRanked = await axios.get(`${process.env.LOL_URL}/lol/league/v4/entries/by-summoner/${id}`,
    {headers: {'X-Riot-Token':process.env.LOL_KEY}}).catch(e=>{
        return res.status(e.response.status).json(e.response.data);
    })

    const {tier,rank,wins,losses,queueType} = responseRanked.data[0]?responseRanked.data[0]:
    responseRanked.data[1];

    return res.json({
        summonerLevel,
        name,
        tier,
        rank,
        wins,
        losses,
        queueType,
        url: `${process.env.LOL_ICONS}/${profileIconId}.png`,
        winRate: ((wins/(wins+losses))*100).toFixed(1)
    })
})


server.listen(3000,console.log("running"));