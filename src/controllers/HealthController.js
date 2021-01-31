class HealthController {
    health(req, res) {
        return res.json({ "message" : "Everything is working fine :)" });
    }
}

module.exports  = new HealthController();