import { EvilIcons, FontAwesome6, AntDesign } from "@expo/vector-icons";
import { images, samples } from "../constants";

export const SocialMedia = [
  {
    alt: "Facebook",
    icon: images.facebook,
    route: "/",
  },
  {
    alt: "Google",
    icon: images.google,
    route: "/",
  },
  {
    alt: "X",
    icon: images.twitter,
    route: "/",
  },
];

//DUMMY DATA FOR UPCOMING EXP
export const exp = [
  {
    expName: "Bunny Tour",
    expArtist: "JK",
    expLink: "[user]/upcoming_experiences/[artist]/[experience]",
    expImage: samples.sample1,
  },
  {
    expName: "Jeff's Tour",
    expArtist: "JS",
    expLink: "[user]/upcoming_experiences/[artist]/[experience]",
    expImage: samples.sample2,
  },
  {
    expName: "Seggsy Tour",
    expArtist: "JW",
    expLink: "[user]/upcoming_experiences/[artist]/[experience]",
    expImage: samples.sample3,
  },
  {
    expName: "Dilf Tour",
    expArtist: "AD",
    expLink: "[user]/upcoming_experiences/[artist]/[experience]",
    expImage: samples.sample4,
  },
];
