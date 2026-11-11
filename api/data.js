import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const data = await kv.get('rankList') || [];
        return res.status(200).json(data);
    }
    if (req.method === 'POST') {
        const body = req.body;
        let list = await kv.get('rankList') || [];
        if(body.action === "clear"){
            list = [];
        }else if(body.action === "delete"){
            list = list.filter(x=>x.name !== body.name);
        }else if(body.action === "update"){
            const {name, dScore, dProposal} = body;
            const exist = list.find(x=>x.name === name);
            if(exist){
                exist.score = Math.max(0, exist.score + dScore);
                exist.proposal = Math.max(0, exist.proposal + dProposal);
            }else{
                list.push({
                    name,
                    score: Math.max(0, dScore),
                    proposal: Math.max(0, dProposal)
                })
            }
        }
        await kv.set('rankList', list);
        return res.status(200).json({ok:true});
    }
    return res.status(405).end();
}

