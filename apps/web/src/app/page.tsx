import Image from "next/image";
import { Card } from "@repo/ui/card";
import { Code } from "@repo/ui/code";
import styles from "./page.module.css";
import { Button } from "@repo/ui/button";
import Chart from "../components/Chart";
import { Player, PLAYER_SEEDS } from "@repo/engine";

function Gradient({
  conic,
  className,
  small,
}: {
  small?: boolean;
  conic?: boolean;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={[
        styles.gradient,
        conic ? styles.glowConic : undefined,
        small ? styles.gradientSmall : styles.gradientLarge,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}


const PlayerCard = ({ player }: { player: Partial<Player> & { imageSrc: string } }) => {

  return (
    <div >
      <div className="card bg-base-100 w-96 shadow-xl ">
        <figure className="px-10 pt-10">
          <img
            src={player?.imageSrc}
            alt="Player"
            className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{player.name}</h2>
          <div className="form-control">
            <label className="cursor-pointer label">
              <input type="checkbox" defaultChecked className="checkbox checkbox-info" />
            </label>
          </div>
        </div>
      </div>



    </div>
  )
}

const LINKS = [
  {
    title: "Docs",
    href: "https://turbo.build/repo/docs",
    description: "Find in-depth information about Turborepo features and API.",
  },
  {
    title: "Learn",
    href: "https://turbo.build/repo/docs/handbook",
    description: "Learn more about monorepos with our handbook.",
  },
  {
    title: "Templates",
    href: "https://turbo.build/repo/docs/getting-started/from-example",
    description: "Choose from over 15 examples and deploy with a single click.",
  },
  {
    title: "Deploy",
    href: "https://vercel.com/new",
    description:
      "Instantly deploy your Turborepo to a shareable URL with Vercel.",
  },
];

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <div className={styles.description}>

      </div>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logos}>
            <div className={styles.circles}>
              <Image
                alt=""
                height={614}
                src="circles.svg"
                width={614}
                style={{ pointerEvents: "none" }}
              />
            </div>
            <div className={styles.logoGradientContainer}>
              <Gradient className={styles.logoGradient} conic small />
            </div>

            {/* <div className={styles.logo}>
              <Image
                alt=""
                height={614}
                src="/banner.png"
                width={800}
                style={{ pointerEvents: "none" }}
              />
            </div> */}
          </div>
          <Gradient className={styles.backgroundGradient} conic />
          <div className={styles.turborepoWordmarkContainer}>
            <h2 className="text-4xl">
              <Image
                alt=""
                height={614}
                src="/title.png"
                width={1024}
              />
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-6 m-4">
        {
          PLAYER_SEEDS.map((seed) => {
            return <PlayerCard player={seed} />

          })
        }

      </div>

      <Button appName="web" className={styles.button} >
        start with players
      </Button>


    </main >
  );
}
