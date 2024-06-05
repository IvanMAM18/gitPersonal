import axios from "axios";
import { useState } from "react";

export default function useGetResolutivoImage() {
    const [image, setImage] = useState(null);

    const getResolutivoImage = (data) => {
        axios
            .get(`/app/get_resolutivo_image/?url=${data.url}`, {
                responseType: "blob",
                as: "blob",
            })
            .then((response) => {
                /*console.log(`div#${data.field}`);
                const img = document.createElement("img");
                img.src = URL.createObjectURL(response.data);
                img.width = "100%";
                const imageContainer = document.querySelector(
                    `div#${data.field}`
                );
                console.log({ imageContainer });
                //imageContainer.appendChild(img);
                document.body.appendChild(img);*/
                response.data.arrayBuffer().then((res) =>
                    setImage({
                        imageBytes: res,
                        type: data.url.split(".")[1],
                        field: data.field,
                    })
                );
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return [image, getResolutivoImage];
}
