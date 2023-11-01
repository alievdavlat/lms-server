import { Request } from "express";
import { IUser } from "../models/user.model";


declare global {
  namespace Express {
    interface Request {
      user?:IUser
    }
  }
}


interface IRegisterationBody {
  name:string;
  email:string;
  password:string;
  avatar?:string;
}

interface IActivationToken {
  token : string,
  activationCode: string;
}


interface EmailOptions {
  email: string;
  subject: string;
  template:string;
  data:{[key:string]:any};
}

interface IActivationRequest {
  activation_token:string;
  activation_code:string;
}

interface ILoginRequest {
  email:string;
  password:string;
}

interface ITokenOptions {
expires:Date;
maxAge:number;
httpOnly:boolean;
sameSizes:'lax' | 'strict' | 'none' | undefined;
secure?:boolean;
}

interface ISocialAuthBody {
  email:string;
  name:string;
  avatar:string;
}

interface IUpdateUserInfo {
  name?:string;
  email?:string;
}

interface IUpdatePassword {
  oldPassword:string;
  newPassword:string;
}

interface IUpdateProfilePicture {
  avatar:string
}

interface IAddQuestionData {
  question:string;
  courseId:string;
  contentId:string;
}

interface IAddAnswerData {
  answer:string;
  courseId:string;
  contentId:string;
  questionId:string;
}

interface IAddReviewData {
  review:string;
  courseId:string;
  rating:number;
  userId:string;
  
}


interface IAddReplyReviewData {
  comment:string;
  courseId:string;
  reviewId:string;
}


export {
  IRegisterationBody,
  IActivationToken,
  EmailOptions,
  IActivationRequest,
  ILoginRequest,
  ITokenOptions,
  ISocialAuthBody,
  IUpdateUserInfo,
  IUpdatePassword,
  IUpdateProfilePicture,
  IAddQuestionData,
  IAddAnswerData,
  IAddReviewData,
  IAddReplyReviewData
}