import { ObjectId } from "mongodb";
import { number } from "motion";


interface ArtistDetails {
  name:string;
  image: string;
  id:string;
  url:string;
}

interface TopTrackResultItem {
  name:string,
  id:string,
  type:string;
  popularity:number;
  duration_ms: number;
  explicit:boolean;
  img?:string;
  release?: string;
  album_name?:string;
  album_img?:string;
  album?: {
    album_type:string;
    id:string;
    images: {
      url:string;
      width:number;
    }[];
    release_date:string;
    release_date_precision:string;
    name:string;
  },

  artists : {name:string, id:string}[]
}

interface TopTracksResult {
  next  :string, 
  prev  :string, 
  items :TopTrackResultItem[]
} 

interface ShareDetails {
  views : number;
  likes : number;
}

interface SpotiArtResult {
  _id?    :any;
  date    : Date;
  name    : string;
  count   : number;
  owner   : string;
  owner_name : string;
  artists : ArtistDetails[];
  items   : TopTrackResultItem[];
  public  : boolean;
  share_details : ShareDetails;
}

interface AnalysisIdentifier
{
  id:ObjectId; 
  name:string; 
  date:Date;
}

interface UserProfile {
  _id?:any;
  account_id    : string;
  display_name  : string;
  email         : string;
  name?         : string;
  
  external_urls : {
    spotify?: string;
  },
  
  followers?    : {
    href? : string;
    total : number;
  },

  href?   : string;
  id      : string;
  images  : { height: number, width: number, url: string }[];
  type?   : string;
  uri?    : string;
  genres? : string[];

  results     : AnalysisIdentifier[];
  subscribed  : boolean;
  subscription_date? : Date;
  access_token : string;
  refresh_token: string;

  last_analysis: Date;
}

export type { UserProfile, TopTracksResult, SpotiArtResult, ArtistDetails, AnalysisIdentifier,
  ShareDetails
 }