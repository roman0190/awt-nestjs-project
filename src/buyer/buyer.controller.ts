import{Controller, Get,Post,Put, Patch, Delete, Param, Query, Body, } from "@nestjs/common";
import { BuyerService } from "./buyer.service";


@Controller('buyer')  // root Route
export class BuyerController{

    constructor(private readonly buyerservice: BuyerService){}
    
    @Post('register')
    register(@Body() userData:any)
    {
        return this.buyerservice.register(userData)
    }


    @Post('login')
    login(@Body() credentials: any)
    {
        return this.buyerservice.login(credentials);
    }

    @Post('logout')
    logout()
    {
        return {massage: "Logged out"};
    }

    @Get('browse-gigs')
     browseGigs()
    {
        return this.buyerservice.browseGigs();
    }

    @Get('search-gigs')
    searchAccount(@Query() query:any)
    {
        return this.buyerservice.searchGigs(query.keywords);
    }

    @Put('view-gig/:gig_id')
    viewAccount(@Param('gig_id') gigId:string)
    {
        return this.buyerservice.viewGig(gigId);
    }

    @Get('place-order/:gig_id')
    placeOrder(@Param('gig_id') gigId:string)
    {
        return this.buyerservice.placeOrder(gigId);
    }

    @Post('message-seller/:seller_id')
    messageSeller(@Param('seller_id') sellerId:string, @Body() message:any)
    {
        return this.buyerservice.messageSeller(sellerId, message);
    }

    @Post('leave-review/:order_id')
    leaveReview(@Param('order_id') orderId:string, @Body() reviewData:any)
    {
        return this.buyerservice.leaveReview(orderId, reviewData);
    }

    @Get('track-order/:order_id')
    trackOrder(@Param('order_id') orderId: string) {
      return this.buyerservice.trackOrder(orderId);
    }

    @Post('choose-payment-method')
    choosePaymentMethod(@Body() paymentData: any) {
    return this.buyerservice.choosePaymentMethod(paymentData);
    }

    @Post('create-wishlist')
    createWishlist(@Body() wishlistData: any) {
    return this.buyerservice.createWishlist(wishlistData);
    }

    @Post('request-customization')
    requestCustomization(@Body() requestData: any) {
    return this.buyerservice.requestCustomization(requestData);
    }

    @Get('view-order-history')
    viewOrderHistory() {
    return this.buyerservice.viewOrderHistory();
    }

    @Post('manage-budget')
    manageBudget(@Body() budgetData: any) {
    return this.buyerservice.manageBudget(budgetData);
    }

    @Post('access-dispute-resolution')
    accessDisputeResolution(@Body() issueData: any) {
    return this.buyerservice.accessDisputeResolution(issueData);
    }

    @Get('receive-gig-recommendations')
    receiveGigRecommendations() {
    return this.buyerservice.receiveGigRecommendations();
    }


    @Post('customize-notification-preferences')
    customizeNotificationPreferences(@Body() preferencesData: any) {
    return this.buyerservice.customizeNotificationPreferences(preferencesData);
    }

    @Post('report-inappropriate-content')
    reportInappropriateContent(@Body() reportData: any) {
    return this.buyerservice.reportInappropriateContent(reportData);
    }

    @Get('access-real-time-support')
    accessRealTimeSupport() {
    return this.buyerservice.accessRealTimeSupport();
  }
}
