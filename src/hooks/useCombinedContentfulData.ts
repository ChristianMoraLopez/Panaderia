import useContentfulData from "@/hooks/usePortfolioPictures";
import { ContentItem, ExtendedAsset } from "@/types/PortfolioContentFulTypes"; // Ensure correct paths
import { AssetFields, AssetSys, VideoFields, ContentfulData, CombinedFields } from "@/types/PortfolioContentFulTypes";


const useCombinedContentfulData = (): {
  combinedData: ContentItem[];
  loading: boolean;
  error: Error | null;
} => {
  const {
    data: firstData,
    loading: firstLoading,
    error: firstError,
  } = useContentfulData("1ebZQKrlJyZH30jRAj7bKe");
  const {
    data: secondData,
    loading: secondLoading,
    error: secondError,
  } = useContentfulData("1aFPiWEyvcq0amHhH6SXvq");

  const combinedData: ContentItem[] = [
    ...(firstData?.fields.images || []).map((img: ExtendedAsset): ContentItem => ({
      ...img,
      category: firstData?.fields.technic || "Uncategorized",
      type: "image" as const,
      metadata: {
        tags: img.metadata?.tags || [], // Ensure tags is an array of TagLink
      },
      sys: {
        ...img.sys,
        locale: img.sys.locale || "en-US", // Asignar un valor por defecto si es undefined
      } as AssetSys, // Asegúrate de que sys es compatible con AssetSys
      fields: img.fields as AssetFields | VideoFields, // Handle type discrimination
    })),
    ...(secondData?.fields.images || []).map((img: ExtendedAsset): ContentItem => ({
      ...img,
      category: secondData?.fields.technic || "Uncategorized",
      type: "image" as const,
      metadata: {
        tags: img.metadata?.tags || [], // Ensure tags is an array of TagLink
      },
      sys: {
        ...img.sys,
        locale: img.sys.locale || "en-US", // Asignar un valor por defecto si es undefined
      } as AssetSys, // Asegúrate de que sys es compatible con AssetSys
      fields: img.fields as AssetFields | VideoFields, // Handle type discrimination
    })),
  ];

  
// Manejar los datos de video si están disponibles
const handleVideoData = (data: ContentfulData) => {
  if (data?.fields.video) {
    combinedData.push({
      ...data.fields.video,
      category: data.fields.technic || "Uncategorized",
      type: "video" as const,
      sys: {
        ...data.fields.video.sys,
        locale: data.fields.video.sys.locale || "en-US", // Ensuring locale is not undefined
      } as AssetSys,
      fields: {
        title: data.fields.video.fields.title, // Title must be a string
        description: data.fields.video.fields.description || "", // Ensure description is a string
        file: data.fields.video.fields.file
      } as CombinedFields, // Ensure the structure matches CombinedFields
    });
  }
};


  handleVideoData(firstData!);
  handleVideoData(secondData!);

  const loading = firstLoading || secondLoading;
  const error = firstError || secondError;

  return {
    combinedData,
    loading,
    error,
  };
};

export default useCombinedContentfulData;
