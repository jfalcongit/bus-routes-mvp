interface Props {
  lat: number;
  lng: number;
}

export default function StaticMapThumb({ lat, lng }: Props) {
  const src = `https://maps.googleapis.com/maps/api/staticmap?size=300x150&zoom=11&scale=2&markers=color:0x6f32d4|${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  return (
    <img
      src={src}
      alt="route thumbnail"
      className="h-[84px] w-[168px] rounded-md border-2 border-brand-purple-dark object-cover"
    />
  );
}
