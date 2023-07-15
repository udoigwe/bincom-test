const db = require('../utils/dbConfig');
const util = require('util');
const requestIp = require('request-ip');

module.exports = {
    submitScore: async (req, res) => {
        const currentDate = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timestampWithTimezone = currentDate.toISOString().replace("Z", `${timezone}[UTC]`);
        const clientIP = requestIp.getClientIp(req);

        const { 
            polling_unit, 
            party,
            score,
            entered_by
         } = req.body;

        const required = [
            'polling_unit',
            'party',
            'score',
            'entered_by'
        ];

        //check if any required field is empty
        for(let [ key, value ] of Object.entries(req.body))
        {
            if(required.includes(key) && !value)
            {
                res.json({
                    error:true,
                    message:`${key} is required`
                });

                return false;
            }
        }

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const pollingUnits = await util.promisify(connection.query).bind(connection)("SELECT * FROM polling_unit WHERE uniqueid = ? LIMIT 1", [polling_unit]);

            if(pollingUnits.length == 0)
            {
                throw new Error('Polling Unit does not exist')
            }

            const scores = await util.promisify(connection.query).bind(connection)("SELECT * FROM announced_pu_results WHERE polling_unit_uniqueid = ? AND party_abbreviation = ? LIMIT 1", [pollingUnits[0].uniqueid, party]);

            if(scores.length > 0)
            {
                throw new Error(`Scores already exists for ${party} in ${pollingUnits[0].polling_unit_name} polling unit. Dont come and rig this election oooo. (:`);
            }

            await util.promisify(connection.query).bind(connection)("INSERT INTO announced_pu_results (polling_unit_uniqueid, party_abbreviation, party_score, entered_by_user, date_entered, user_ip_address) VALUES (?, ?, ?, ?, ?, ?)", [pollingUnits[0].uniqueid, party, score, entered_by, timestampWithTimezone, clientIP]);

            res.json({
                error:false,
                message:'Polling Unit result submitted successfully'
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    fetchStates: async (req, res) => {

        let query = "SELECT * FROM states";
        const queryParams = [];

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const rows = await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error:false,
                states:rows
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    fetchLGAs: async (req, res) => {

        const { state_id } = req.query;

        let query = "SELECT * FROM lga WHERE 1 = 1";
        const queryParams = [];

        if(state_id)
        {
            query += ` AND state_id = ?`;
            queryParams.push(state_id);
        }

        query += ` ORDER BY lga_name`;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const rows = await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error:false,
                lgas:rows
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    fetchWards: async (req, res) => {

        const { lga_id } = req.query;

        let query = "SELECT * FROM ward WHERE 1 = 1";
        const queryParams = [];

        if(lga_id)
        {
            query += ` AND lga_id = ?`;
            queryParams.push(lga_id);
        }

        query += ` ORDER BY ward_name`;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const rows = await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error:false,
                wards:rows
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    fetchPollingUnits: async (req, res) => {

        const { ward_id } = req.query;

        let query = "SELECT * FROM polling_unit WHERE 1 = 1";
        const queryParams = [];

        if(ward_id)
        {
            query += ` AND ward_id = ?`;
            queryParams.push(ward_id);
        }

        query += ` ORDER BY polling_unit_name`;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const rows = await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error:false,
                polling_units:rows
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    fetchParties: async (req, res) => {

        const { party_id } = req.query;

        let query = "SELECT * FROM party WHERE 1 = 1";
        const queryParams = [];

        if(party_id)
        {
            query += ` AND party_id = ?`;
            queryParams.push(party_id);
        }

        query += ` ORDER BY partyname`;

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const rows = await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error:false,
                parties:rows
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    fetchPollingUnitResults: async (req, res) => {

        const { polling_unit_id, party_abbreviation } = req.query;

        const connection = await util.promisify(db.getConnection).bind(db)();

        let query = "SELECT * FROM announced_pu_results WHERE 1 = 1";
        const queryParams = [];

        if(polling_unit_id)
        {
            query += ` AND polling_unit_uniqueid = ?`;
            queryParams.push(polling_unit_id);
        }

        if(party_abbreviation)
        {
            query += ` AND party_abbreviation = ?`;
            queryParams.push(party_abbreviation);
        }

        query += ` ORDER BY party_score DESC`;

        try
        {
            const rows = await util.promisify(connection.query).bind(connection)(query, queryParams);

            res.json({
                error:false,
                polling_unit_results:rows
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    },
    fetchLGATotalPollingUnitResults: async (req, res) => {

        const { lga_id } = req.query;

        let query = "SELECT uniqueid FROM polling_unit WHERE 1 = 1";
        const queryParams = [];
        let total = 0;

        if(lga_id)
        {
            query += ` AND lga_id = ?`;
            queryParams.push(lga_id);
        }

        const connection = await util.promisify(db.getConnection).bind(db)();

        try
        {
            const rows = await util.promisify(connection.query).bind(connection)(query, queryParams);

            for(let i = 0; i < rows.length; i++)
            {
                const row = rows[i];

                const scores = await util.promisify(connection.query).bind(connection)("SELECT SUM(party_score) AS total_score FROM announced_pu_results WHERE polling_unit_uniqueid = ?", [row.uniqueid]);

                total += scores[0].total_score || 0;
            }

            res.json({
                error:false,
                total
            })
        }
        catch(e)
        {
            res.json({
                error:true,
                message:e.message
            })
        }
        finally
        {
            connection.release();
        }
    }
}