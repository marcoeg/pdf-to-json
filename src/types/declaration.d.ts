declare module 'multer' {
    interface StorageEngine {}
  
    interface MulterOptions {
      storage?: StorageEngine;
    }
  
    interface Multer {
      single(fieldname: string): any;
    }
  
    interface MulterStatic {
      (options?: MulterOptions): Multer;
      memoryStorage(): StorageEngine;
    }
  
    const multer: MulterStatic;
    export default multer;
  }
  
  //declare module 'express';
