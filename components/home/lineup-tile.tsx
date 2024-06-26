import { get } from "@/api";
import Carousel from "../common/carousel";
import TileHeader from "./tile-header";
import { LineupInfo } from "@/app/[locale]/(back-nav)/lineup/page";
import { getTranslations } from "next-intl/server";
import { API_ROUTES } from "@/constants";

export default async function LineupTile() {
  try {
    const allDay = ["FIRST_DAY", "SECOND_DAY", "THIRD_DAY"] as const;
    const data = await Promise.all(
      allDay.map((day) => get<LineupInfo[]>(API_ROUTES.lineup.list(day))),
    );
    const lineups = data.flat();

    const t = await getTranslations("LineupTile");

    return (
      <div className="w-full">
        <TileHeader>
          <TileHeader.Head>{t("title")}</TileHeader.Head>
          <TileHeader.SeeAll href="/lineup">{t("seeAll")}</TileHeader.SeeAll>
        </TileHeader>
        <div className="relative aspect-[3/4] w-full">
          <Carousel lineups={lineups} />
        </div>
      </div>
    );
  } catch (error) {
    const e = error as Error;
    console.error(error);
    return <span className="w-full text-neutral-500">{e.message}</span>;
  }
}
