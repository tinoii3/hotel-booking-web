import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'เกิดข้อผิดพลาดที่ไม่คาดคิด';
      
      if (error.status === 401) {
        errorMessage = 'กรุณาเข้าสู่ระบบอีกครั้ง';
      } else if (error.status === 404) {
        errorMessage = 'ไม่พบข้อมูลที่ต้องการ (404)';
      } else if (error.status === 500) {
        errorMessage = 'เซิร์ฟเวอร์เกิดข้อผิดพลาด (500)';
      }

      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage
      });

      return throwError(() => error);
    })
  );
};