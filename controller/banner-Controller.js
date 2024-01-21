const Banner=require('../model/bannerModel')


module.exports={
    getBanner:async (req,res)=>{
        try{
            const banner=await Banner.find()
            res.render('admin/banner',{banner})
        }catch{
            console.log(err);
        }
    },
    getAddbanner:(req,res)=>{
        try{
            res.render('admin/addBanner')
        }catch(err){
            console.log(err);
        }
    },
    postAddbanner:async(req,res)=>{
        try{
            console.log("working banner",req.body,req.files)
            req.body.bannerImage=req.files.bannerImage[0].filename
            // Assuming req.body is an array of banner objects
            console.log(req.body)
            const banners = req.body;

            // Create each banner individually and push it to the array
           const banner=await Banner.find()
         
            // Create a new document with the provided banners array
            await Banner.create(banners);
          
          
          res.redirect('/admin/getBanner')
         
        }catch(err){
            console.log(err);
        }
    },
    deleteBanner:async(req,res)=>{
        try{
            await Banner.deleteOne({_id:req.params.bannerid})
            res.json(true)
        }catch(err){
            console.log(err);
        }
    }
}