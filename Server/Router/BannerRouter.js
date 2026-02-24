const express = require("express");
const upload = require("../MiddleWare/Multer");
const { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner, bannerStatusBanner } = require("../Controller/BannerController");
const BannerRouter = express.Router();


BannerRouter.post("/create-banner", upload.single("bannerImage"), createBanner);
BannerRouter.get("/get-banners", getAllBanners);
BannerRouter.get("/get-single-banner/:id", getBannerById);
BannerRouter.put("/update-banner/:id", upload.single("bannerImage"), updateBanner);
BannerRouter.delete("/delete-banner/:id", deleteBanner);
BannerRouter.put("/banner/status-banner/:id", bannerStatusBanner);
module.exports = BannerRouter;
