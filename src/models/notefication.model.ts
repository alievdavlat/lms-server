import mongoose, { Document, Model,Schema } from "mongoose";


export interface INotefication  extends Document {
  title: string;
  message: string;
  status: string;
  userId: string;
}

const noteficationSchema = new Schema<INotefication>({
  title:{
    type:String,
    required:true,
  },

  message:{
    type:String,
    required:true,
  },

  status:{
    type:String,
    required:true,
    default:"unread"
  },

  // userId:
}, {
  timestamps:true
})


const NoteficationModel:Model<INotefication> = mongoose.model('Notefication', noteficationSchema);

export default NoteficationModel