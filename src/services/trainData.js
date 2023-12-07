import { Post, Get, Del, Patch } from "../utils/request"
export const getTrainData = async ()=>{
    const result = await Get(`traindata`);
    return result;
  }
  export const postTrainData = async (objectData)=>{
   
    const result = await Post(`traindata`,objectData);
    
    return result;
  }
  export const deleteTrainData = async (id)=>{
    const result = await Del(`traindata/${id}`);
    return result
  }

  export const getDataTrainByLabel  = async (label)=>{
    const result = await Get(`traindata?label=${label}`);
    return result
  }