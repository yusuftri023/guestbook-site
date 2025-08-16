import type { MetadataRoute } from "next";
const BASE_URL = process.env.NEXTAUTH_URL;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  // const getPartner: () => Promise<{ data: Employer[] }> = async () => {
  //   return fetch(getServerBaseUrl() + "/public-companies")
  //     .then((res) => res.json())
  //     .catch(() => ({ data: [] }));
  // };

  // const getBlogs: () => Promise<{ data: Blog[] }> = async () => {
  //   return fetch(getServerBaseUrl() + "/blogs")
  //     .then((res) => res.json())
  //     .catch(() => ({ data: [] }));
  // };

  // const blogSitemap: MetadataRoute.Sitemap = (await getBlogs()).data.map(
  //   (blog) => ({
  //     url: `${BASE_URL}/blog/${blog.id}`,
  //     lastModified: currentDate,
  //     changeFrequency: `yearly`,
  //     priority: 0.5,
  //   }),
  // );
  // const partnerSitemap: MetadataRoute.Sitemap = (await getPartner()).data.map(
  //   (partner) => ({
  //     url: `${BASE_URL}/partner/${partner.id}`,
  //     lastModified: currentDate,
  //     changeFrequency: `yearly`,
  //     priority: 0.5,
  //   }),
  // );
  return [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: `yearly`,
      priority: 1,
    },

    // ...blogSitemap,
    // ...partnerSitemap,
  ];
}
