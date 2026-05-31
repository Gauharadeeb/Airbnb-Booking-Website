import Image from "./Image";

export default function PlaceImg({place,index=0,className=null}) {
    if (!className) {
        className = 'object-cover w-full h-full';
    }
    return (

        <Image className={className} src={place?.photos?.[index]} fallbackIndex={index} alt={place?.title || "Property image"}/>

    );
}
