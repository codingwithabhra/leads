const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
const corsOption = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOption));

const { initialisedatabase } = require("./db/db.connect");
const LeadDatas = require("./models/leads.models");

initialisedatabase();

async function createLeadData(newData){
    try {
        const newLead = await LeadDatas(newData);
        const saveLead = newLead.save();
        return saveLead;
    } catch (error) {
        throw error;
    }
};

app.get("/", (req, res) => {
    res.send("Welcome to CRM API");
});

//for sending new data to DB ----------------------------------
app.post("/leads", async(req, res) => {
    try {
        const newLead = await createLeadData(req.body);
        res.status(201).json({message: "Data added successfully", data: newLead});
    } catch (error) {
        res.status(500).json({error: "Failed to add data into database"});
    }
});

//for fetching all data from DB ----------------------------------
async function getallLeads(){
    try {
        const allLeads = await LeadDatas.find();
        return allLeads;
    } catch (error) {
        throw error;
    }
};

app.get("/leads", async(req, res) => {
    try {
        const allLeads = await getallLeads();
        if(allLeads.length != 0){
            res.json(allLeads);
        } else {
            res.status(404).json({error:"Data not found"});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch data from database"});
    }
})

//to update DB ------------------------------------------------------
async function updateLeads(leadId, dataToUpdate){
    try {
        const updateData = await LeadDatas.findByIdAndUpdate(leadId, dataToUpdate, {new: true});
        return updateData;
    } catch (error) {
        throw error;
    }
};

app.post("/leads/:leadId", async(req, res) => {
    try {
        const updateLeadData = await updateLeads(req.params.leadId, req.body);
        if(updateLeadData){
            res.status(201).json({message: "Data updated successfully", updateLeadData: updateLeadData});
        } else {
            res.status(404).json({error: "Data not found"});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update"});
    }
});

//to delete lead data from DB ---------------------------------------
async function deleteLeadData(leadId){
    try {
        const deleteData = await LeadDatas.findByIdAndDelete(leadId);
        return deleteData;
    } catch (error) {
        throw error;
    }
};

app.delete("/leads/:leadId", async(req, res) => {
    try {
        const deleteData = await deleteLeadData(req.params.leadId);
        if(deleteData){
            res.status(201).json({message: "Data deleted successfully"});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to delete data"});
    }
})


const PORT = 3000;
app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`);
})