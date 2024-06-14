const mongoose = require('mongoose')

const DockBookingSchema = new mongoose.Schema(
    {
        Lname: String,
        Ctype: String,
        Tname: String,
        Ttype: String,
        Lcode: String,
        Otype: String,
        Tcode: String,
        Tremark: String,
        LOdate: String,
        Oremark:String,
        Caddress:String,
        Bno: String,
        Dname:String,
        ENtime: String,
        EXtime: String,
    }
)

const DockBookingModel = mongoose.model("dockbooking", DockBookingSchema)

module.exports = DockBookingModel