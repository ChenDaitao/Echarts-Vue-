// 读取文件的工具方法
const { rejects } = require('assert')
const fs = require('fs')
const { resolve } = require('path')
module.exports.getFileJsonData = (filePath) => {
    // 根据文件的路径 读取文件的内容
   return new Promise((resolve,reject)=>{
    fs.readFile(filePath,'utf-8',(error,data)=>{
        if(error){
            reject(error)
        }
        else{
            resolve(data)
        }
    })
   })
}