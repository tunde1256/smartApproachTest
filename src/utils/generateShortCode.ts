import * as crypto from 'crypto';

let counter = 0;

export const generateShortCode = (): string => {
    const length = 6;

    const randomBytes = crypto.randomBytes(8);  
    const randomPart = randomBytes.toString('base64').replace(/[^A-Za-z0-9]/g, '');

    const counterPart = (counter += 2).toString();

    const combined = counterPart + randomPart;

    let shortCode = Buffer.from(combined).toString('base64').replace(/[^A-Za-z0-9]/g, '');

    shortCode = shortCode.substring(0, length);
    while (shortCode.length < length) {
        shortCode += 'A';  
    }

    return shortCode;
};
// import { v4 as uuidv4 } from 'uuid';

// export const generateShortCode = (): string => {
//     const uuid = uuidv4(); 

//     const shortCode = uuid.replace(/[^A-Za-z0-9]/g, '').substring(0, 6); 

//     return shortCode;
// };
