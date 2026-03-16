import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(

    catchError((error) => {

      if (error.status === 401) {

        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'Please login again'
        });

      }

      if (error.status === 500) {

        Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: 'Something went wrong. Please try again later.'
        });

      }

      return throwError(() => error);

    })

  );

};