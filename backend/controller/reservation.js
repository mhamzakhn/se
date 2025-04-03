import ErrorHandler from "../error/error.js";
import {Reservation} from "../models/reservationSchema.js";

export const sendReservation = async (req,res,next) => {
    console.log("request body:",req.body);
    const { firstName, lastName, email, phone, date, time } = req.body || {};
    if(!firstName || !lastName || !email || !phone || !date || !time)
    {
        return next(new ErrorHandler("Please fill full reservation form!",400));
    }
    try{
        await Reservation.create({firstName,lastName,email,phone,date,time});
        res.status(200).json({
            sucess: true,
            messege: "Reservation sent successfully!",
        });
    }
    catch(error)
    {
        if(error.name === "ValidationError")
            {
                const validationError = Object.values(error.errors).map(
                    (err) => err.message
                );
                return next(new ErrorHandler(validationError.join(" , "), 400));
            }
            return next(error);  
    }
};