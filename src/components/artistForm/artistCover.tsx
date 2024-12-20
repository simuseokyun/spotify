import styled from 'styled-components';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { commaSeparate, getLocalStorage } from '../../utils/util';
import { getArtist } from '../../api/api';
import { IArtistInfo } from '../../types/artistInfo';
import { Message, Loading, LoadingWrap } from '../../styles/common.style';

const TopWrap = styled.div`
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    @media (max-width: 425px) {
        height: 200px;
    }
`;
const Top = styled.div<{ $img: string }>`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url(${({ $img }) => $img});
    background-position: center;
    background-size: cover;
    opacity: 0.7;
`;
const TopOverlay = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 20px;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    @media (max-width: 425px) {
        padding: 10px;
    }
`;
const Name = styled.h1`
    font-size: 36px;
    font-weight: 700;
    @media (max-width: 768px) {
        font-size: 24px;
    }
    @media (max-width: 425px) {
        font-size: 20px;
    }
`;
const Follower = styled.span`
    font-size: 18px;
    margin-top: 10px;
    @media (max-width: 425px) {
        font-size: 14px;
    }
`;
export const ArtistCover = () => {
    const token = getLocalStorage('webAccessToken') || '';
    const { artistId } = useParams();
    const {
        isLoading,
        data: artistInfo,
        isError,
    } = useQuery<IArtistInfo>(['artistCover', artistId], async () => {
        if (artistId) {
            const artistData = await getArtist(token, artistId);
            return artistData;
        } else {
            return Promise.resolve(null);
        }
    });
    if (isLoading) {
        return (
            <LoadingWrap>
                <Loading src="/images/loading.png" />
            </LoadingWrap>
        );
    }
    if (isError || !artistInfo) {
        return <Message>에러 발생</Message>;
    }
    return (
        <TopWrap>
            <Top $img={artistInfo?.images[0].url}></Top>
            <TopOverlay>
                <Name>{artistInfo?.name}</Name>
                <Follower>팔로워 : {commaSeparate(artistInfo?.followers.total)}명</Follower>
            </TopOverlay>
        </TopWrap>
    );
};
