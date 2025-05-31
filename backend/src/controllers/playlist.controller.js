import { db } from "../libs/db.js";

export const getAllPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;

    const playlists = await db.playlist.findMany({ where: { userId } });

    res.status(200).json({
      message: "Playlists fetched successfully",
      success: true,
      playlists,
    });
  } catch (error) {
    console.error(error, "Error while fetching playlists");
    res.status(500).json({
      error: "Error while fetching playlists",
    });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json({
      message: "Playlist created successfully",
      success: true,
      playlist,
    });
  } catch (error) {
    console.error(error, "Error while creating playlist");
    res.status(500).json({
      error: "Error while creating playlist",
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const deletedPlaylist = await db.playlist.delete({
      where: { id: playlistId },
    });

    res.status(200).json({
      message: "Playlist deleted successfully",
      success: true,
      deletedPlaylist,
    });
  } catch (error) {
    console.error(error, "Error while deleting playlist");
    res.status(500).json({
      error: "Error while deleting playlist",
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        error: "Invalid problems list",
      });
    }

    const problemsInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    res.status(201).json({
      message: "Problems successfully added to playlist",
      success: true,
      problemsInPlaylist,
    });
  } catch (error) {
    console.error(error, "Error while adding problem to playlist");
    res.status(500).json({
      error: "Error while adding problem to playlist",
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        error: "Invalid problems list",
      });
    }

    const problemsInPlaylist = await db.problemsInPlaylist.deleteMaby({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      message: "Problems successfully deleted from playlist",
      success: true,
      problemsInPlaylist,
    });
  } catch (error) {
    console.error(error, "Error while deleting problems from playlist");
    res.status(500).json({
      error: "Error while deleting problems from playlist",
    });
  }
};

export const getPlaylistDetails = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.id;

    const playlist = await db.playlist.findUnique({
      where: { id: playlistId, userId },
    });
    if (!playlist) {
      res.status(404).json({
        error: "Playlist not found",
      });
    }

    res.status(200).json({
      message: "Playlist fetched successfully",
      success: true,
      playlist,
    });
  } catch (error) {
    console.error(error, "Error while fetching playlist");
    res.status(500).json({
      error: "Error while fetching playlist",
    });
  }
};
