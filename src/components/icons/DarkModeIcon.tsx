import Icon from "@ant-design/icons/lib";
import * as React from "react";

const DarkModeSvg: React.FC = (): JSX.Element => (
    <svg height="1.2em" viewBox="0 0 512.002 512.002" width="1.5em"
         xmlns="http://www.w3.org/2000/svg">
        <g>
            <path
                d="m288.489 512.002c-68.829 0-133.538-26.804-182.206-75.473-48.669-48.669-75.472-113.378-75.472-182.207 0-61.328 21.914-120.744 61.705-167.304 39.343-46.036 93.733-76.866 153.149-86.811 6.419-1.079 12.791 2.108 15.789 7.881 2.997 5.773 1.933 12.818-2.635 17.448-38.912 39.436-60.341 91.655-60.341 147.041 0 115.449 93.924 209.374 209.373 209.374 28.886 0 56.873-5.783 83.185-17.189 5.975-2.588 12.939-1.029 17.234 3.862 4.298 4.892 4.949 11.998 1.611 17.589-22.462 37.628-54.362 69.141-92.251 91.129-39.068 22.676-83.725 34.66-129.141 34.66z"
                fill="#f4d752"
            />
            <path
                d="m188.997 512.002h-139.197c-27.459 0-49.799-22.34-49.799-49.799 0-23.273 16.047-42.868 37.658-48.303 3.043-16.773 11.172-32.186 23.569-44.346 15.623-15.326 36.282-23.767 58.171-23.767s42.548 8.44 58.171 23.766c12.396 12.161 20.525 27.573 23.569 44.347 21.611 5.435 37.658 25.029 37.658 48.303-.001 27.459-22.34 49.799-49.8 49.799z"
                fill="#aedcfe"
            />
            <path
                d="m462.201 259.966h-139.196c-27.46 0-49.8-22.34-49.8-49.799 0-23.273 16.047-42.868 37.658-48.303 3.043-16.773 11.172-32.186 23.568-44.347 15.623-15.326 36.282-23.767 58.172-23.767 21.889 0 42.548 8.44 58.171 23.767 12.396 12.161 20.525 27.573 23.569 44.347 21.61 5.435 37.657 25.029 37.657 48.303.001 27.459-22.339 49.799-49.799 49.799z"
                fill="#9ecafd"
            />
            <path
                d="m491.035 364.764c-26.311 11.405-54.299 17.189-83.185 17.189-52.078 0-99.772-19.117-136.444-50.696v180.174c5.662.369 11.357.571 17.083.571 45.416 0 90.072-11.984 129.141-34.658 37.889-21.988 69.789-53.501 92.251-91.129 3.338-5.591 2.686-12.697-1.611-17.589-4.296-4.891-11.26-6.45-17.235-3.862z"
                fill="#efbf42"
            />
        </g>
    </svg>
);

export const DarkModeIcon: React.FC<any> = (props: any) : JSX.Element => <Icon component={DarkModeSvg} {...props}/>;