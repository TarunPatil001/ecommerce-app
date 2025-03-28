import { Router } from 'express';
import {addReview, authWithGoogle, deleteMultipleUsers, forgotPasswordController, getAllReviews, getAllUsers, getReview, loginUserController, logoutController, refreshToken, registerUserController, removeImageFromCloudinary, resendOtpController, resetPassword, updateUserDetails, userAvatarController, userDetails, verifyEmailController, verifyForgotPasswordOtp} from '../controllers/user.controller.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const userRouter = Router();
userRouter.post('/register', registerUserController);
userRouter.post('/resend-otp', resendOtpController);
userRouter.post('/verifyEmail', verifyEmailController);
userRouter.post('/login', loginUserController);
userRouter.post('/authWithGoogle', authWithGoogle);
userRouter.get('/logout', auth, logoutController);
userRouter.put('/user-avatar', auth, upload.array('avatar'), userAvatarController);
userRouter.delete('/deleteImage', auth, removeImageFromCloudinary);
userRouter.put('/:id', auth, updateUserDetails);
userRouter.post('/forgot-password', forgotPasswordController);
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/refresh-token', refreshToken);
userRouter.get('/user-details', auth, userDetails);
userRouter.get('/get-all-user', auth, getAllUsers);
userRouter.post('/addReview', auth, addReview);
userRouter.get('/getReviews', getReview);
userRouter.get('/get-all-reviews', getAllReviews);
userRouter.post("/delete-multiple-users", auth, deleteMultipleUsers);

export default userRouter;
