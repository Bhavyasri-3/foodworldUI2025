import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  decodeToken(token: string): any {
    console.log("service ",token);
    
    if (!token) {
      return null;
    }

    try {
      // Extract payload from JWT token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error("Invalid Token Format");
      }

      const payload = atob(tokenParts[1]); // Decode base64 payload
      return JSON.parse(payload); // Convert JSON string to object

    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  // Function to extract the username from JWT token
  getUsernameFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.username || decoded.sub || null : null;
  }
}
