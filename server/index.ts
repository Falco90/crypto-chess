import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

// prepare attestation -- backend
// submit attestation -- backend
// retrieve proof and data -- backend
// verify proof -- backend
// send proof and data to frontend
// interact with contract -- frontend

app.post('/api/add-player', async (req, res) => {
    const { contractAddress, url, name } = req.body;

    //prepare attestation

    res.json({ proof: '' });
}
);

app.post('/api/finish-tournament', async (req, res) => {
    const { contractAddress, args } = req.body;
    res.json({ proof: '' })
})

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});