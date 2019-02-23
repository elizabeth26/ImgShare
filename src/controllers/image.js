const path=require('path');
const {randomNumber}=require('../helpers/libs');
const fs=require('fs-extra');


const  {Image,Comment}=require('../models/index');

const ctrl={};
ctrl.index=async(req,res)=>{
//console.log('param',req.params.image_id)
 const image=await Image.findOne({filename:{$regex:req.params.image_id}});
 console.log('image');
 res.render('image',{image});
};

ctrl.create=(req,res)=>{

    const saveImage=async()=>{   
        const imgUrl= randomNumber();
        const images=await Image.find({filename:imgUrl});

        if(images.length>0){
            saveImage();
        }
        else{
            const imageTempPath=req.file.path;
            const ext=path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
            if(ext==='.png'||ext==='.jpg'||ext==='.jpeg'||ext==='.gif'){
                await fs.rename(imageTempPath,targetPath);

                const newImg =new Image({
                    title:req.body.title,
                    filename:imgUrl+ ext,
                    description:req.body.description,

                });
                const Imagesave=await newImg.save();

                res.redirect('/images/'+ imgUrl);
            }
            else{
                await fs.unlink(imageTempPath);
                res.status(500).json({error:'Only images are allowed'})
            }
            

        }     
    }

    saveImage();




};

ctrl.like=(req,res)=>{

};

ctrl.comment=(req,res)=>{
console.log(req.body);
const newComment=new Comment(req.body)
console.log(newComment);
res.send("comm");
};

ctrl.remove=(req,res)=>{

};


module.exports=ctrl;