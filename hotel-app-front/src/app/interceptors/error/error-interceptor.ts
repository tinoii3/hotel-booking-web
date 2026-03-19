import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(

    catchError((error) => {

      if (error.status === 401) {

        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเข้าถึงได้',
          text: 'กรุณาเข้าสู่ระบบอีกครั้ง'
        });

      }

      if (error.status === 500) {

        Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: 'เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้งในภายหลัง'
        });

      }

      return throwError(() => error);

    })

  );

};