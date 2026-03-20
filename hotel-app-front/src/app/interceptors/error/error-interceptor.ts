import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpContextToken } from '@angular/common/http';

export const SKIP_ERROR_ALERT = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const skipAlert = req.context.get(SKIP_ERROR_ALERT);

  return next(req).pipe(
    catchError((error) => {
      if (skipAlert) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        return throwError(() => error);
      }

      let errorMessage = 'เกิดข้อผิดพลาดที่ไม่คาดคิด';

      if (error.status === 404) {
        errorMessage = 'ไม่พบข้อมูลที่ต้องการ (404)';
      } else if (error.status === 500) {
        errorMessage = 'เซิร์ฟเวอร์เกิดข้อผิดพลาด (500)';
      }

      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage,
      });

      return throwError(() => error);
    }),
  );
};
