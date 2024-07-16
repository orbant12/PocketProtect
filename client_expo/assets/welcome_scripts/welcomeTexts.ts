
type ReqTypes = {
    type:"spot_check" | "full_check";
    fullname:string;
    sessionId:string;

}

export const WelcomeTexts = (req:ReqTypes) => {
    if ( req.type == "spot_check" ) {
        const message = `Hey ${req.fullname}! I've got your request (Purchase ID: ${req.sessionId}) and your mole is being rewied very soon. Thank you for your purchase and stay healthy ! `
        return message
    }
}