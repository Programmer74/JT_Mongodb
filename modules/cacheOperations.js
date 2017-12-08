module.exports = {

    /**
     * delete from redis
     * @param client - redisClient
     * @param id - KEY
     */
    deleteCache: function(client, id) {
        client.del(id, function (err, reply) {
            if (!err) {
                if (reply == 1) console.log("> Deleted from cache ", id);
                else console.log("Doesn't exist");
            }
        }).catch(function() {
            console.log("Error!");
        });
    },

    setCache: function (client, entity, interval) {
        client.setex(entity._id, interval, JSON.stringify(entity))
    }
};